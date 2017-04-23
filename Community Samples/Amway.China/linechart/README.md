Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\Coresight" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\Coresight"

2. From within the folder named "Coresight", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. If this a symbol that uses the hightcharts library (if so, the symbol will contain "hightcharts" in the name), download the hightcharts JavaScript Charts library zip file from https://www.highcharts.com/download.  Now that the "ext" folder exists, or already exits, extract the contents of the .ZIP file that you just downloaded into the "ext" folder.  The "ext" folder should now contain folders for "api", "examples", "gfx", "graphics", and "js", and you should have just pasted in the following .js files: highcharts.js or use hightcharts.js in "linechart" folder directly, the hightchart version is 4.2.3.

5. Now that the "ext" folder exists, or already exits, open it, and paste into the "ext" folder the two .js and one .html files contained in the "linechart" folder.

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.