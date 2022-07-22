import geocoder
import pandas as pd
from pyDataverse.api import NativeApi, DataAccessApi
from pyDataverse.models import Dataverse
import xlrd

DOI = "doi:10.5072/FK2/JGT4GH"
API_TOKEN = "ac71d785-30b7-4fd0-9c16-6cf118783533"
BASE_URL = "https://datacommons.tdai.osu.edu"
datasets = ["Jackson", "Scioto"]


api = NativeApi(BASE_URL, API_TOKEN)
data_api = DataAccessApi(BASE_URL, API_TOKEN)

dataset = api.get_dataset(DOI) 
files_list = dataset.json()['data']['latestVersion']['files']

for  file in files_list:
    filename = file["dataFile"]["filename"]
    if "OIBRS" in filename and "Jackson" in filename:
        file_id = file["dataFile"]["id"]
        response = data_api.get_datafile(file_id)
        with open(filename, "wb") as f:
            f.write(response.content)
            f.close()
    elif "OIBRS Scioto County.tab" in filename:
        file_id = file["dataFile"]["id"]
        response = data_api.get_datafile(file_id)
        with open(filename, "wb") as f:
            f.write(response.content)
            f.close()

jackson_data = pd.read_csv('OIBRS Jackson County Data.tab', sep="\t")
scioto_data = pd.read_csv('OIBRS Scioto County.tab', sep="\t")

for row in jackson_data.itertuples():
    





print(scioto_data)



