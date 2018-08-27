from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler


class autopy_handler(IPythonHandler):
    def post(self):
        print(self.request.body)
        print("Autopy POST received, saving")
        self.finish('Hello, world2!')


def load_jupyter_server_extension(nb_server_app):
    print('Autopy server extension has been loaded')
    web_app = nb_server_app.web_app
    host_pattern = '.*$'
    route_pattern = url_path_join(web_app.settings['base_url'], '/autopy')
    web_app.add_handlers(host_pattern, [(route_pattern, autopy_handler)])
