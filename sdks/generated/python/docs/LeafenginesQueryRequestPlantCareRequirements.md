# LeafenginesQueryRequestPlantCareRequirements


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sun_exposure** | **str** |  | [optional] 
**water_needs** | **str** |  | [optional] 
**soil_ph_range** | [**LeafenginesQueryRequestPlantCareRequirementsSoilPhRange**](LeafenginesQueryRequestPlantCareRequirementsSoilPhRange.md) |  | [optional] 

## Example

```python
from soilsidekick.models.leafengines_query_request_plant_care_requirements import LeafenginesQueryRequestPlantCareRequirements

# TODO update the JSON string below
json = "{}"
# create an instance of LeafenginesQueryRequestPlantCareRequirements from a JSON string
leafengines_query_request_plant_care_requirements_instance = LeafenginesQueryRequestPlantCareRequirements.from_json(json)
# print the JSON string representation of the object
print(LeafenginesQueryRequestPlantCareRequirements.to_json())

# convert the object into a dict
leafengines_query_request_plant_care_requirements_dict = leafengines_query_request_plant_care_requirements_instance.to_dict()
# create an instance of LeafenginesQueryRequestPlantCareRequirements from a dict
leafengines_query_request_plant_care_requirements_from_dict = LeafenginesQueryRequestPlantCareRequirements.from_dict(leafengines_query_request_plant_care_requirements_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


