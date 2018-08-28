from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
import notebook
import json
import os


class autopy_handler(IPythonHandler):
    def post(self):
        print("Autopy POST received, saving")
        data = json.loads(self.request.body)

        file_name = data.pop(0)
        file_name = os.getcwd() + file_name[0: file_name.find('.ipynb')] + '.py'
        print('Saved file path: ' + file_name)

        file = open(file_name, 'w')
        for line in data:
            file.write(line + '\n')
        file.close()

        self.finish('Success')


def load_jupyter_server_extension(nb_server_app):
    web_app = nb_server_app.web_app
    route_pattern = url_path_join(web_app.settings['base_url'], '/autopy')
    web_app.add_handlers('.*$', [(route_pattern, autopy_handler)])
    print('Autopy server extension has been loaded')
