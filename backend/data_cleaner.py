import geocoder

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