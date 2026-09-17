# CalculateEnvironmentalImpactRequestSoilData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ph_level** | **float** |  | [optional] 
**organic_matter** | **float** |  | [optional] 
**slope** | **str** |  | [optional] 
**drainage** | **str** |  | [optional] 
**nitrogen_level** | **str** |  | [optional] 
**phosphorus_level** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.calculate_environmental_impact_request_soil_data import CalculateEnvironmentalImpactRequestSoilData

# TODO update the JSON string below
json = "{}"
# create an instance of CalculateEnvironmentalImpactRequestSoilData from a JSON string
calculate_environmental_impact_request_soil_data_instance = CalculateEnvironmentalImpactRequestSoilData.from_json(json)
# print the JSON string representation of the object
print(CalculateEnvironmentalImpactRequestSoilData.to_json())

# convert the object into a dict
calculate_environmental_impact_request_soil_data_dict = calculate_environmental_impact_request_soil_data_instance.to_dict()
# create an instance of CalculateEnvironmentalImpactRequestSoilData from a dict
calculate_environmental_impact_request_soil_data_from_dict = CalculateEnvironmentalImpactRequestSoilData.from_dict(calculate_environmental_impact_request_soil_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


