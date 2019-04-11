# House inventory versus quality of life indicator choropleth

This is just a prototype to demonstrate how you could combine affordable 
housing inventory over time and quality of life indicators on a choropleth
to generally show where priorities for housing have been and to what degree
they do or not provide housing in areas with high opportunity or quality of
life.

This is just a prototype, so there are steps that would need to be taken to
finish it, in addition to design improvements -- such as selecting, adding
and cleaning the data more completely. Make sure you read the TODO section 
below.

# Design consideration

The decision to shade towns based on housing inventory and outline towns based
on quality of life indicator(s) was meant to show whether these things were 
"lining up." However there are significant design challenges with outlining. 
For instance, if you outline all of towns that border one town that is not 
outlined, it will be outlined by all of the shared borders. One possible 
solution might be to use categorical shading for towns with or above or below
the 10% Affordable Housing threshold and at or below the quality of life
threshold.

### Building the code

The code for this map is contained in this repository in the 
/src/ConnHousingInventory folder. (Paths with / in this doct are relative to 
the root of the repo being discussed.)

Install from the root of the repo with:

    $ yarn

Build from the root with:

    $ yarn build

The product is in in the /templates/ConnHousingInventory.

Several other packages also get built at the same time because this is a shared
codebase I've been using for code for some basic chart types. Those directories
can be ignore except to the extent you need to modify them as depencies for 
this project. For instance, all of these graphics inherit from Viz or 
ThrottledViz classes, which handle some boilerplate stuff. The difference 
between Viz and ThrottledViz is that ThrottledViz automatically calls its 
draw() function when the viewport size changes.

### Topojson layer details

This map has four five shape layers. One for CT towns (county subdivisions) and
three for school districts (elemntary, secondary and unified), as well as one 
for the outline of the state. These files are from the Census Bureau, converted
to topojson using mapshaper.

### TODO (!Important)

The underlying housing data for this prototype was pulled from the data cleanup 
repo in the folder:

    /scripts/Affordable housing rates by town analysis/out

The python code to generate those files is in the immediate folder one ../ up.

The school scores data was poached from another project just for demo purposes
as the school scores (NextGen Accountability) will probably not be the desired
quality of life metric. Those can be obtained from edsight.ct.gov.
