// package the topojson files with their respective 
// object so they can be converted to geojson with
// topojson.feature

var connTownsTopo = require("./ct-towns.json"),
    connTowns = { topo: connTownsTopo, obj: connTownsTopo.objects.towns };

var connElemDistrictsTopo = require("./ct_elem_districts.json"),
    connElemDistricts = { topo: connElemDistrictsTopo, obj: connElemDistrictsTopo.objects.cb_2017_09_elsd_500k };

var connSecondaryDistrictsTopo = require("./ct_secondary_districts.json"),
    connSecondaryDistricts = { topo: connSecondaryDistrictsTopo, obj: connSecondaryDistrictsTopo.objects.tl_2018_09_scsd }

var connUnifiedDistrictsTopo = require("./ct_unified_districts.json"),
    connUnifiedDistricts = { topo: connUnifiedDistrictsTopo, obj: connUnifiedDistrictsTopo.objects.cb_2017_09_unsd_500k }

module.exports = { connTowns, connElemDistricts, connSecondaryDistricts, connUnifiedDistricts  };
