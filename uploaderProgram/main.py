import eel
import os
import io
import json
import base64
from github import Github, Auth, InputGitTreeElement
from PIL import Image
import boto3

# Git Repo Constants
ACCESS_TOKEN = input("Github Access Token: ")
REPO_NAME = 'silasiscool/mccauleycomic'
FILE_PATH = 'data/comic_metadata.json' 
BRANCH = 'main'

# Setup R2
s3 = boto3.client('s3',
    endpoint_url='https://bc7a9fb92192e0b4751bce178fa6f622.r2.cloudflarestorage.com',
    aws_access_key_id=input("R2 Access Key: "),
    aws_secret_access_key=input("R2 Secret Key: "),
    region_name="auto"
)

# Lists
addMetadataList = []
addFileDataList = []

# Setup GUI
base_path = os.path.dirname(os.path.abspath(__file__))
web_folder = os.path.join(base_path, 'web')
eel.init(web_folder)

# GUI output functions
@eel.expose
def dataReturn(metadata, fileData):
    addMetadataList.append(metadata)
    addFileDataList.append(fileData)

    eel.checkSubmitAgain()

@eel.expose
def uploadFiles():
    print('Uploading files')

    addMetadata(addMetadataList)
    print('Metadata Uploaded')

    addFiles(addFileDataList)
    print('Files Uploaded')

    print('Upload Complete, Closing')
    eel.messageUser('Files Uploaded, Closing')
    eel.closeApp()


# Function to push new metadata to git repo
def addMetadata(addMetadataList):
    # Get repo
    auth = Auth.Token(ACCESS_TOKEN)
    g = Github(auth=auth)
    repo = g.get_repo(REPO_NAME)

    # Get file tree
    ref = repo.get_git_ref(f"heads/{BRANCH}")
    latest_commit = repo.get_git_commit(ref.object.sha)
    tree = repo.get_git_tree(latest_commit.tree.sha, recursive=True)

    # Get file
    file_sha = None
    for element in tree.tree:
        if element.path == FILE_PATH:
            file_sha = element.sha
            break
    if not file_sha:
        raise FileNotFoundError(f"The file '{FILE_PATH}' was not found in the '{BRANCH}' branch of {REPO_NAME}.")

    # Get data
    blob = repo.get_git_blob(file_sha)
    data = json.loads(base64.b64decode(blob.content).decode('utf-8'))
    
    data['comics'].extend(addMetadataList)

    new_blob = repo.create_git_blob(json.dumps(data, indent=4), 'utf-8') 

    element = [InputGitTreeElement(path=FILE_PATH, mode='100644', type='blob', sha=new_blob.sha)]
    new_tree = repo.create_git_tree(element, latest_commit.tree)

    new_commit = repo.create_git_commit("Updated comic_metadata.json using uploaderProgram", new_tree, [latest_commit])
    ref.edit(new_commit.sha)

    print('Metadata update success')

    g.close()

# Function to add new images to storage
def addFiles(addFileDataList):
    for file in addFileDataList:
        print(file)
        id = file['id']
        base64Str = file['base64Str']

    # Get image bytes
    if "," in base64Str:
        header, encoded = base64Str.split(",", 1)
    else:
        encoded = base64Str
    imageData = base64.b64decode(encoded)

    # Open the image using Pillow and Bytes IO to make it act like a file
    img = Image.open(io.BytesIO(imageData))

    # Convert to WebP
    webpBuffer = io.BytesIO()
    img.save(webpBuffer, format="WEBP", quality=80)
    webpData = webpBuffer.getvalue()

    fileName = f"{id}.webp"
    s3.put_object(
        Bucket='comic-images',
        Key=fileName,
        Body=webpData,
        ContentType='image/webp'
    )

# Start GUI
eel.start('index.html', size=(600, 500))


