import eel
import os

base_path = os.path.dirname(os.path.abspath(__file__))
web_folder = os.path.join(base_path, 'web')
eel.init(web_folder)

eel.start('index.html')