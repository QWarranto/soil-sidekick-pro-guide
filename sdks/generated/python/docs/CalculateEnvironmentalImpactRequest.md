# CalculateEnvironmentalImpactRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_id** | **UUID** |  | 
**county_fips** | **str** |  | 
**soil_data** | [**CalculateEnvironmentalImpactRequestSoilData**](CalculateEnvironmentalImpactRequestSoilData.md) |  | 
**proposed_treatments** | [**List[CalculateEnvironmentalImpactRequestProposedTreatmentsInner]**](CalculateEnvironmentalImpactRequestProposedTreatmentsInner.md) |  | [optional] 
**water_body_data** | [**CalculateEnvironmentalImpactRequestWaterBodyData**](CalculateEnvironmentalImpactRequestWaterBodyData.md) |  | [optional] 

## Example

```python
from soilsidekick.models.calculate_environmental_impact_request import CalculateEnvironmentalImpactRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CalculateEnvironmentalImpactRequest from a JSON string
calculate_environmental_impact_request_instance = CalculateEnvironmentalImpactRequest.from_json(json)
# print the JSON string representation of the object
print(CalculateEnvironmentalImpactRequest.to_json())

# convert the object into a dict
calculate_environmental_impact_request_dict = calculate_environmental_impact_request_instance.to_dict()
# create an instance of CalculateEnvironmentalImpactRequest from a dict
calculate_environmental_impact_request_from_dict = CalculateEnvironmentalImpactRequest.from_dict(calculate_environmental_impact_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


