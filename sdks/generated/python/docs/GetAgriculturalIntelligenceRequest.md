# GetAgriculturalIntelligenceRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | 
**analysis_type** | **str** |  | 

## Example

```python
from soilsidekick.models.get_agricultural_intelligence_request import GetAgriculturalIntelligenceRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetAgriculturalIntelligenceRequest from a JSON string
get_agricultural_intelligence_request_instance = GetAgriculturalIntelligenceRequest.from_json(json)
# print the JSON string representation of the object
print(GetAgriculturalIntelligenceRequest.to_json())

# convert the object into a dict
get_agricultural_intelligence_request_dict = get_agricultural_intelligence_request_instance.to_dict()
# create an instance of GetAgriculturalIntelligenceRequest from a dict
get_agricultural_intelligence_request_from_dict = GetAgriculturalIntelligenceRequest.from_dict(get_agricultural_intelligence_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


