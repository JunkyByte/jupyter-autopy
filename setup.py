import setuptools

setuptools.setup(
    name="jupyter-autopy",
    version='0.0',
    packages=['jupyter-autopy'],
    include_package_data=True,
    data_files=[
        ("/share/jupyter/nbextensions/jupyter-autopy", [
            "jupyter-autopy/static/index.js",
            "jupyter-autopy/static/index.yaml",
            "jupyter-autopy/static/README.md",
        ]),
        ("etc/jupyter/nbconfig/notebook.d", [
            "jupyter-config/nbconfig/notebook.d/jupyter-autopy.json"
        ]),
        ("etc/jupyter/jupyter_notebook_config.d", [
            "jupyter-config/jupyter_notebook_config.d/jupyter-autopy.json"
        ])
    ],
    zip_safe=False
)
