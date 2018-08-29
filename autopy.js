define([
    'require',
    'jquery',
    'base/js/namespace'
], function(
    requirejs,
    $,
    Jupyter){

        var tag_name = 'autopy';

        var set_bg = function(cell){
            state = cell.metadata.autopy;
            if (state == null)
                add_metadata(cell);

            if (state == 1)
                cell.input[0].childNodes[1].style.backgroundColor = params.highlightedColor;
            else if (state == 2)
                cell.input[0].childNodes[1].style.backgroundColor = params.highlightedColorMain;
            else
                cell.input[0].childNodes[1].style.backgroundColor = '';
        }

        var add_metadata = function(cell){
            cell.metadata.autopy = 0; // 0 is disabled, 1 is default, 2 is main
        }

        var change_state = function(cell, type){
            state = cell.metadata.autopy;
            if (state == null)
                add_metadata(cell);

            if (state != type)
                cell.metadata.autopy = type;
            else
                cell.metadata.autopy = 0;

            set_bg(cell);
        }

        var clear_all_states = function(){
            cells = Jupyter.notebook.get_cells();
            for (var i=0; i < cells.length; i++){
                state = cells[i].metadata.autopy;
                if (state == null){
                    add_metadata();
                    continue;
                }

                cells[i].metadata.autopy = 0;
            }
        }

        var restoreBackgrounds = function(){
            var cells = Jupyter.notebook.get_cells();
            for (var i=0; i < cells.length; i++){
                set_bg(cells[i]);
            }
        }

        var mark_selected_default = function(){
            var selected_cell = Jupyter.notebook.get_selected_cell();
            change_state(selected_cell, 1);
        }

        var mark_selected_main = function(){
            var selected_cell = Jupyter.notebook.get_selected_cell();
            change_state(selected_cell, 2);
        }

        var copy_cells = function(){
            var cells = Jupyter.notebook.get_cells();
            var name = Jupyter.notebook.base_url + Jupyter.notebook.notebook_path;
            var def = [name]; // to store normal cells + name of notebook
            var main = []; // to store main cells

            for (var i=0; i < cells.length; i++){
                if (cells[i].metadata.autopy != null && cells[i].metadata.autopy != 0){
                    if (cells[i].metadata.autopy == 1)
                        def.push(cells[i].get_text());
                    else
                        main.push(cells[i].get_text());
                }
            }

            data = [def, main];

            $.ajax({
                type: "post",
                url: "/autopy",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    console.log('Reponse from autopy server: ' + response);
                }
            });
        }

        var copy_button = function () {
            if (!IPython.toolbar) {
                $([IPython.events]).on("app_initialized.NotebookApp", copy_button);
                return;
            }

            if ($("#gist_notebook").length === 0) {
                IPython.toolbar.add_buttons_group([
                    {
                        'label'   : 'autopy',
                        'help'    : 'Copy to py file selected cells',
                        'icon'    : 'fa-arrow-circle-o-right',
                        'callback': copy_cells,
                        'id'      : 'copy_button'
                    },
                ]);
            }
        }

        var params = {
            highlightedColor : '',
            highlightedColorMain : ''
        };

        var initialize = function () {
            $.extend(true, params, Jupyter.notebook.config.data['autopy']);
            if (params.highlightedColor == '')
                params.highlightedColor = 'rgba(21, 233, 233, 0.2)';
            if (params.highlightedColorMain == '')
                params.highlightedColorMain = 'rgba(228, 62, 62, 0.2)';

            restoreBackgrounds();
            copy_button();

            Jupyter.keyboard_manager.command_shortcuts.add_shortcut('t', mark_selected_default);
            Jupyter.keyboard_manager.command_shortcuts.add_shortcut('y', mark_selected_main);
        }

        var load_jupyter_extension = function() {
            return Jupyter.notebook.config.loaded.then(initialize);
        };

        return {
            load_jupyter_extension : load_jupyter_extension,
            load_ipython_extension : load_jupyter_extension  };
        });
