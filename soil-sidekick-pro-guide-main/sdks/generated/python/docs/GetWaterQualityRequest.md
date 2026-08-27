# GetWaterQualityRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | 

## Example

```python
from soilsidekick.models.get_water_quality_request import GetWaterQualityRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetWaterQualityRequest from a JSON string
get_water_quality_request_instance = GetWaterQualityRequest.from_json(json)
# print the JSON string representation of the object
print GetWaterQualityRequest.to_json()

# convert the object into a dict
get_water_quality_request_dict = get_water_quality_request_instance.to_dict()
# create an instance of GetWaterQualityRequest from a dict
get_water_quality_request_form_dict = get_water_quality_request.from_dict(get_water_quality_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


