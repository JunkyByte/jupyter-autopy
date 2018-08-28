define([
  'require',
  'jquery',
  'base/js/namespace'
], function(
  requirejs,
  $,
  Jupyter) {

  var tag_name = 'autopy';

  var set_bg = function(cell){
    state = cell.metadata.autopy;
    if (state == null){
      add_metadata(cell);
      set_bg(cell);
    }

    if (state){
      cell.input[0].childNodes[1].style.backgroundColor = params.highlightedColor;
    } else
      cell.input[0].childNodes[1].style.backgroundColor = '';
  }

  var add_metadata = function(cell){
    cell.metadata.autopy = false;
  }

  var change_state = function(cell){
    state = cell.metadata.autopy;
    if (state == null){
      add_metadata(cell);
      change_state(cell);
    }

    if (! state){
      cell.metadata.autopy = true;
      set_bg(cell);
    } else
      cell.metadata.autopy = false;
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

      cells[i].metadata.autopy = false;
    }
  }

  var restoreBackgrounds = function(){
    var cells = Jupyter.notebook.get_cells();
    for (var i=0; i < cells.length; i++){
      set_bg(cells[i]);
    }
  }

  var mark_selected = function(){
    var selected_cell = Jupyter.notebook.get_selected_cell();
    change_state(selected_cell);
  }

  var copy_cells = function(){
    var cells = Jupyter.notebook.get_cells();
    var name = Jupyter.notebook.base_url + Jupyter.notebook.notebook_path;
    var data = [name];
    for (var i=0; i < cells.length; i++){
      if (cells[i].metadata.autopy != null && cells[i].metadata.autopy == true){
        data.push(cells[i].get_text());
      }
    }

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
    params.highlightedColorMain = 'rgba(228, 62, 62, 0.5)';

  restoreBackgrounds();
  copy_button();

  Jupyter.keyboard_manager.command_shortcuts.add_shortcut('t', mark_selected);
}

var load_jupyter_extension = function() {
  return Jupyter.notebook.config.loaded.then(initialize);
};

return {
  load_jupyter_extension : load_jupyter_extension,
  load_ipython_extension : load_jupyter_extension  };
});
