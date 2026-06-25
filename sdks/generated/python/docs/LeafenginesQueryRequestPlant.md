# LeafenginesQueryRequestPlant


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**common_name** | **str** |  | [optional] 
**scientific_name** | **str** |  | [optional] 
**plant_id** | **str** |  | [optional] 
**care_requirements** | [**LeafenginesQueryRequestPlantCareRequirements**](LeafenginesQueryRequestPlantCareRequirements.md) |  | [optional] 

## Example

```python
from soilsidekick.models.leafengines_query_request_plant import LeafenginesQueryRequestPlant

# TODO update the JSON string below
json = "{}"
# create an instance of LeafenginesQueryRequestPlant from a JSON string
leafengines_query_request_plant_instance = LeafenginesQueryRequestPlant.from_json(json)
# print the JSON string representation of the object
print(LeafenginesQueryRequestPlant.to_json())

# convert the object into a dict
leafengines_query_request_plant_dict = leafengines_query_request_plant_instance.to_dict()
# create an instance of LeafenginesQueryRequestPlant from a dict
leafengines_query_request_plant_from_dict = LeafenginesQueryRequestPlant.from_dict(leafengines_query_request_plant_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


