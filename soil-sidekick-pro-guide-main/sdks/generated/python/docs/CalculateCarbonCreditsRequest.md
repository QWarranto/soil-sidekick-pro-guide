# CalculateCarbonCreditsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field_name** | **str** | Name of the field | 
**field_size_acres** | **float** | Field size in acres | 
**soil_organic_matter** | **float** | Soil organic matter percentage | [optional] 
**soil_analysis_id** | **str** | Reference to existing soil analysis | [optional] 
**verification_type** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.calculate_carbon_credits_request import CalculateCarbonCreditsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CalculateCarbonCreditsRequest from a JSON string
calculate_carbon_credits_request_instance = CalculateCarbonCreditsRequest.from_json(json)
# print the JSON string representation of the object
print CalculateCarbonCreditsRequest.to_json()

# convert the object into a dict
calculate_carbon_credits_request_dict = calculate_carbon_credits_request_instance.to_dict()
# create an instance of CalculateCarbonCreditsRequest from a dict
calculate_carbon_credits_request_form_dict = calculate_carbon_credits_request.from_dict(calculate_carbon_credits_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


