from flask import Flask, jsonify, render_template
import json
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
from flask_cors import CORS
from pytopojson import feature
import numpy as np
from shapely.geometry import Polygon, Point
import logging


app = Flask(__name__)
CORS(app)
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"
counties_list = []
api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)
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

def get_data(file_wanted):
    DOI =  "doi:10.5072/FK2/P9B4YV"
    dataset = api.get_dataset(DOI)

    files_list = dataset.json()['data']['latestVersion']['files']
    geoJsons = []
    file_wanted = file_wanted + '.geojson'
    for file in files_list:
        filename = file["dataFile"]["filename"]
        if filename == file_wanted:
            file_id = file["dataFile"]["id"]
            print("File name {}, id {}".format(filename, file_id))
            response = data_api.get_datafile(file_id)
            rc = response.content
            geojson = json.loads(rc.decode('utf-8'))
            #print(geojson)
            #geojson["type"] = "FeatureCollection"
            finalGeoJson = { "type": "FeatureCollection","features": []}
            for feature in geojson["features"]:
                lng = feature["geometry"]["coordinates"][0]
                lat = feature["geometry"]["coordinates"][1]
                is_there =  (is_in_county("Scioto", lng, lat) or is_in_county("Jackson", lng, lat))
                if (is_there):
                    #jss["features"].remove(feature)
                    finalGeoJson["features"].append(feature)

            return finalGeoJson   
    return None

def get_county_data(county_id):
    global counties_list
    for c in counties_list:
        if c["properties"]["NAME"] == county_id:
            poly = c
    return poly


@app.before_first_request
def load_counties():
    global counties_list
    with open("counties.json", "r") as f:
        counties_json = json.load(f)
    fe = feature.Feature()
    counties_list = fe(counties_json, 'cb_2015_ohio_county_20m')['features']

@app.route('/api/<file_id>')
def return_geojson(file_id):
    return jsonify(get_data(file_id))

@app.route('/api/county_boundaries/<county_id>')
def return_county_boundary(county_id):
    return jsonify(get_county_data(county_id))



