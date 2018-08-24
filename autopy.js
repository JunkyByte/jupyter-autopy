/*    var gist_button = function () {
        if (!IPython.toolbar) {
            $([IPython.events]).on("app_initialized.NotebookApp", gist_button);
            return;
        }

        if ($("#gist_notebook").length === 0) {
            IPython.toolbar.add_buttons_group([
                {
                    'label'   : 'gist',
                    'help'    : 'Share notebook as gist',
                    'icon'    : 'fa-share',
                    'callback': gist_notebook,
                    'id'      : 'gist_notebook'
                },
            ]);
        }
    }
*/

var tag_name = 'autopy';

var push_on_not_tagged = function(cells){
  for (var i=0; i < cells.length; i++){
    tags = cells[i]['_metadata']['tags'];
    if (! tags)
      continue;
    if (! tags.contain(tag_name))
      cells[i]['_metadata']['tags'].push(tag_name);
  }
}

var clear_tags = function(cells){
  for (var i=0; i < cells.length; i++){
    tags = cells[i]['_metadata']['tags'];
    if (! tags)
      continue;
    index = tags.indexOf(tag_name);
    if (index > -1)
      cells[i]['_metadata']['tags'].splice(index, 1);
  }
}

var clear_all_tags = function(cells){
  for (var i=0; i < cells.length; i++){
    tags = cells[i]['_metadata']['tags'];
    if (! tags)
      continue;

    cells[i]['_metadata']['tags'] = [];
  }
}

define([
    'base/js/namespace'
], function(Jupyter) {
    var exports = {};


    // Show counts of cell types
    var show_stats = function() {

        // Get counts of each cell type
        var cells = Jupyter.notebook.get_cells();
        var selected_cells = Jupyter.notebook.get_selected_cell();
        clear_all_tags(cells);
        console.log(selected_cells);
        console.log(cells[0]['_metadata']['tags']);
        cells[0]['_metadata']['tags'].push('test2');
        console.log(cells[0]['_metadata']['tags']);

        var hist = {};
        for(var i=0; i < cells.length; i++) {
            var ct = cells[i].cell_type;
            if(hist[ct] === undefined) {
                hist[ct] = 1;
            } else {
                hist[ct] += 1;
            }
        }

        // Build paragraphs of cell type and count
        var body = $('<div>');
        for(var ct in hist) {
            $('<p>').text(ct+': '+hist[ct]).appendTo(body);
        }

        // Show a modal dialog with the stats
        Jupyter.dialog.modal({
            title: "Notebook Stats",
            body: body,
            buttons : {
                "OK": {}
            }
        });
    };

    // Wait for notification that the app is ready
    exports.load_ipython_extension = function() {
        // Then register command mode hotkey "s" to show the dialog
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('s', show_stats);
    };

    return exports;
});
