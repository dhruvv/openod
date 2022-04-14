from flask import Flask, jsonify, render_template
import json
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
#from flask_cors import CORS
from pytopojson import feature
import numpy as np
from shapely.geometry import Polygon, Point
import logging

def is_in_county(county, lng, lat):
    global counties_list
    for c in counties_list:
        if c["properties"]["NAME"] == county:
            poly = c
    coords = poly["geometry"]['coordinates'][0]
    polygon = Polygon(coords)
    point = Point(lng, lat)
    #with open("log.txt", "w+") as w:   
    return(polygon.contains(point))

def load_counties():
    global counties_list
    with open("/home/dhruvv/osu_work/backend/counties.json", "r") as f:
        counties_json = json.load(f)
    fe = feature.Feature()
    counties_list = fe(counties_json, 'cb_2015_ohio_county_20m')['features']

load_counties()
with open("/home/dhruvv/osu_work/backend/NPPES.geojson", "r") as w:
    jss = json.load(w)
"""lng = jss["features"][2]["geometry"]["coordinates"][0]
lat = jss["features"][2]["geometry"]["coordinates"][1]"""
"""
lng = -82.552711
lat = 39.023103
"""
ct = 0
finalGeoJson = { "type": "Feature",
  "features": []}
for feature in jss["features"]:
    lng = feature["geometry"]["coordinates"][0]
    lat = feature["geometry"]["coordinates"][1]
    is_there =  (is_in_county("Scioto", lng, lat) or is_in_county("Jackson", lng, lat))
    if (is_there):
        #jss["features"].remove(feature)
        finalGeoJson["features"].append(feature)

print(finalGeoJson)
"""
print(is_in_county("Scioto", lng, lat))
print(is_in_county("Jackson", lng, lat))
"""