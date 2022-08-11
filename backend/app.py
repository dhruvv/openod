from curses import meta
from venv import create
from flask import Flask, jsonify
import json
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
from flask_cors import CORS
from shapely.geometry import Polygon, Point
import xlrd
import hashlib
from os.path import exists

app = Flask(__name__)
CORS(app)
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"
counties_list = []
api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)

def metadata_check(name, doi):
    full_dataset_meta = api.get_datafiles_metadata(doi)
    meta_doi = json.loads(full_dataset_meta.content.decode('utf-8'))
    #print(meta_doi)
    for file in meta_doi["data"]:
         if file["label"] in name:
            hash = file["dataFile"]["checksum"]["value"]
    if exists(name) and hashlib.md5(open(name, 'rb').read()).hexdigest() == hash:
        print("Returning true for {}".format(name))
        return True
    else:
        return False

def createGeoJson(geojson):
    finalGeoJson = { "type": "FeatureCollection","features": []}
    for feature in geojson["features"]:
        lng = feature["geometry"]["coordinates"][0]
        lat = feature["geometry"]["coordinates"][1]
        is_there =  (is_in_county("Scioto", lng, lat) or is_in_county("Jackson", lng, lat))
        if (is_there):
            finalGeoJson["features"].append(feature)
    return finalGeoJson

def is_in_county(county, lng, lat):
    global counties_list
    for c in counties_list:
        if c["properties"]["name"] == county:
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
    if not metadata_check(file_wanted, DOI):
        for file in files_list:
            filename = file["dataFile"]["filename"]
            if filename == file_wanted:
                file_id = file["dataFile"]["id"]
                #print("File name {}, id {}".format(filename, file_id))
                response = data_api.get_datafile(file_id)
                rc = response.content
                geojson = json.loads(rc.decode('utf-8'))
                with open(filename, "w+") as f:
                    f.write(rc)
                    f.close()
                    print("Saved"+filename+"to disk")
    else:
        with open(file_wanted, "r") as f:
            print("Opened file {}".format(file_wanted))
            geojson = json.load(f)
    return createGeoJson(geojson)
    

def get_nibrs_data(year):
    DOI = "doi:10.5072/FK2/ERTNY9"
    dataset = api.get_dataset(DOI)
    files_list = dataset.json()['data']['latestVersion']['files']
    for file in files_list:
        filename = file["dataFile"]["filename"]
        if str(year) in filename:
            file_id = file["dataFile"]["id"]
            if not metadata_check(filename, DOI):
                response = data_api.get_datafile(file_id)
                with open(filename, "wb") as f:
                    f.write(response.content)
                    f.close()
                    print("Saved"+filename+"to disk")
            book = xlrd.open_workbook(filename=filename)
            sh = book.sheet_by_index(0)
            index = 0
            name = sh.cell_value(rowx = 4, colx = index)
            while "Narcotic" not in name:
                index += 1
                name = sh.cell_value(rowx = 4, colx = index)
            index2 = 0
            try:
                county_row_name = sh.cell_value(rowx = index2, colx = 1)
                while "Jackson" != county_row_name:
                    index2 += 1
                    county_row_name = sh.cell_value(rowx = index2, colx = 1)
                j_nibrs = sh.cell_value(rowx = index2, colx = index)
            except:
                 j_nibrs = "Data unavailable for year"
            index3 = 0
            try:
                county_row_name = sh.cell_value(rowx = index3, colx = 1)
                while "Scioto" != county_row_name:
                    index3 += 1
                    county_row_name = sh.cell_value(rowx = index3, colx = 1)
                s_nibrs = sh.cell_value(rowx  = index3, colx = index)
            except:
                 s_nibrs = "Data unavailable for year"      
            nibrsdata = {"Jackson":j_nibrs, "Scioto":s_nibrs}
            return(json.dumps(nibrsdata))
        


def get_county_data(county_id):
    global counties_list
    for c in counties_list:
        if c["properties"]["name"] == county_id:
            poly = c
    return poly

def get_zipcode_data():
    with open("zipcodes.json", "r") as z:
        zc = json.load(z)
    return(zc)


def get_scioto_oibrs_data():
    with open("Scioto County OIBRS.geojson", "r") as f:
        sc = json.load(f)
    return(sc)

def get_jackson_oibrs_data():
    with open("Jackson County OIBRS.geojson", "r") as f:
        sc = json.load(f)
    return(sc)



@app.before_first_request
def load_counties():
    global counties_list
    with open("counties.geojson", "r") as f:
        counties_json = json.load(f)
    '''
    fe = feature.Feature()
    counties_list = fe(counties_json, 'cb_2015_ohio_county_20m')['features']'''
    counties_list = counties_json['features']

@app.route('/api/<file_id>')
def return_geojson(file_id):
    return jsonify(get_data(file_id))

@app.route('/api/county_boundaries/<county_id>')
def return_county_boundary(county_id):
    return jsonify(get_county_data(county_id))

@app.route('/api/zipcode_boundaries')
def return_zipcode_boundaries():
    return jsonify(get_zipcode_data())

@app.route('/api/NIBRS/<year>')
def return_nibrs_data(year):
    return jsonify(get_nibrs_data(year))

@app.route('/api/OIBRS/scioto')
def return_oibrs_data():
    return jsonify(get_scioto_oibrs_data())

@app.route('/api/OIBRS/jackson')
def return_jackson_oibrs_data():
    return jsonify(get_jackson_oibrs_data())