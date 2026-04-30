import eel
import os
import json
import base64
from github import Github, Auth, InputGitTreeElement

# Git Repo Constants
ACCESS_TOKEN = input("Github Access Token: ")
REPO_NAME = 'silasiscool/mccauleycomic'
FILE_PATH = 'comic.json' 
BRANCH = 'main'

# # Vars
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
    print(addFileDataList)
    print(addMetadataList)

# def pushList():
#     # Get current list from git

#     # Get repo
#     auth = Auth.Token(ACCESS_TOKEN)
#     g = Github(auth=auth)
#     repo = g.get_repo(REPO_NAME)

#     # Get file tree
#     ref = repo.get_git_ref(f"heads/{BRANCH}")
#     latest_commit = repo.get_git_commit(ref.object.sha)
#     tree = repo.get_git_tree(latest_commit.tree.sha, recursive=True)

#     # Get file
#     file_sha = None
#     for element in tree.tree:
#         if element.path == FILE_PATH:
#             file_sha = element.sha
#             break
#     if not file_sha:
#         raise FileNotFoundError(f"The file '{FILE_PATH}' was not found in the '{BRANCH}' branch of {REPO_NAME}.")

#     # Get data
#     blob = repo.get_git_blob(file_sha)
#     data = json.loads(base64.b64decode(blob.content).decode('utf-8'))
    
#     data['comics'].extend(addList)

#     new_blob = repo.create_git_blob(json.dumps(data, indent=4), 'utf-8') 

#     element = [InputGitTreeElement(path=FILE_PATH, mode='100644', type='blob', sha=new_blob.sha)]
#     new_tree = repo.create_git_tree(element, latest_commit.tree)

#     new_commit = repo.create_git_commit("Updated comic images using uploaderProgram", new_tree, [latest_commit])
#     ref.edit(new_commit.sha)

#     print('update success')

#     g.close()

#     eel.closeApp()



# Start GUI
eel.start('index.html', size=(600, 500))


