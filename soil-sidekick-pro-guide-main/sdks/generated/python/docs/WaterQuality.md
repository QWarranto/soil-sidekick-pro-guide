# WaterQuality


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**ph** | **float** |  | [optional] 
**dissolved_oxygen** | **float** |  | [optional] 
**turbidity** | **float** |  | [optional] 
**nitrates** | **float** |  | [optional] 
**phosphates** | **float** |  | [optional] 
**contamination_risk** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.water_quality import WaterQuality

# TODO update the JSON string below
json = "{}"
# create an instance of WaterQuality from a JSON string
water_quality_instance = WaterQuality.from_json(json)
# print the JSON string representation of the object
print WaterQuality.to_json()

# convert the object into a dict
water_quality_dict = water_quality_instance.to_dict()
# create an instance of WaterQuality from a dict
water_quality_form_dict = water_quality.from_dict(water_quality_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


