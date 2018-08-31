# jupyter-autopy

### Hey there! Let me introduce you jupyter-autopy </color> <br>
__jupyter-autopy__ is a __Jupyter Notebook__ extensions which
allows you to automatically clone code cells from an open
`.ipynb` to a `.py` standard python file. <br>
This is similar to `.py` export feature __Jupyter__ has by
default but is more advanced as it allows you to mark the cells
you want to be copied (it also features 2 types of marked cells: _default_ and _main_). <br>
<br>
I created this repo to make my standard workflow _smoother_,
allowing me to use __Notebooks__ in a completely _prototyp-ish_
style without having to worry about ordering / polishing up cells
while being able of importing features from standard `.py` files.
<br>

This has also been an Exercise for me as I never write `js`,
don't judge me, my workflow may not be ideal but it really adapts
to how I do things.

------------

## Installation

Unfortunately `js` can't write on arbitrary paths as it would be
a security threat, as I wanted to be able to create and modify
`.py` files on the fly I had to migrate to a __front-end +
back-end__ hybrid extension.
This means that the Installation is a bit more complex.<br>

#### Install Prerequisites <br>
https://github.com/ipython-contrib/jupyter_contrib_nbextensions
<br>
https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator <br>
(You may skip the first one if you are not interested in other extensions)

#### Install front end
```console
cd ~
git clone https://github.com/JunkyByte/jupyter-autopy.git
```
Create symbolic link of the main folder to `~/.local/share/jupyter/nbextensions`
```console
ln -s ~/jupyter-autopy ~/.local/share/jupyter/nbextensions/jupyter-autopy
```
Now the front-end extension is installed. <br>
Let's install the backend.
