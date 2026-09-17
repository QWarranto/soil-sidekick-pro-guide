# SoilData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **UUID** |  | [optional] 
**county_fips** | **str** |  | [optional] 
**county_name** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 
**ph_level** | **float** |  | [optional] 
**organic_matter** | **float** |  | [optional] 
**nitrogen_level** | **str** |  | [optional] 
**phosphorus_level** | **str** |  | [optional] 
**potassium_level** | **str** |  | [optional] 
**recommendations** | **str** |  | [optional] 
**analysis_data** | **Dict[str, object]** |  | [optional] 

## Example

```python
from soilsidekick.models.soil_data import SoilData

# TODO update the JSON string below
json = "{}"
# create an instance of SoilData from a JSON string
soil_data_instance = SoilData.from_json(json)
# print the JSON string representation of the object
print(SoilData.to_json())

# convert the object into a dict
soil_data_dict = soil_data_instance.to_dict()
# create an instance of SoilData from a dict
soil_data_from_dict = SoilData.from_dict(soil_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


