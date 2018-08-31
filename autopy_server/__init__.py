from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
import notebook
import json
import os


class autopy_handler(IPythonHandler):
    def post(self):
        print("[Autopy] POST received, saving")
        data = json.loads(self.request.body)  # 2 Lists, data[0] is def, data[1] is main cells

        default = data[0]
        main = data[1]

        file_name = default.pop(0)  # Name of notebook is stored in data[0][0] (default[0])
        file_name = os.getcwd() + file_name[0: file_name.find('.ipynb')] + '.py'  # This is an imperfect solution to abs path
        print('[Autopy] File path: ' + file_name)

        file = open(file_name, 'w')  # Create file and then write default cells and main cells
        for line in default:
            file.write(line + '\n\n')

        file.write("if __name__ == '__main__':\n    ")
        for line in main:
            line = line.replace('\n', '\n    ')  # Fix indentation on cells with multi lines
            file.write(line + '\n    ')  # Fix indentation for next cell

        file.close()
        self.finish('Success!')


def load_jupyter_server_extension(nb_server_app):
    web_app = nb_server_app.web_app
    route_pattern = url_path_join(web_app.settings['base_url'], '/autopy')
    web_app.add_handlers('.*$', [(route_pattern, autopy_handler)])
    print('[autopy] Server extension has been loaded')
