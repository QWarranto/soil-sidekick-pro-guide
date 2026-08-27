# DynamicCareCareRecommendationsHumidity


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**current_level** | **str** |  | [optional] 
**ideal_range** | **str** |  | [optional] 
**adjustment_recommendation** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_care_recommendations_humidity import DynamicCareCareRecommendationsHumidity

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareCareRecommendationsHumidity from a JSON string
dynamic_care_care_recommendations_humidity_instance = DynamicCareCareRecommendationsHumidity.from_json(json)
# print the JSON string representation of the object
print DynamicCareCareRecommendationsHumidity.to_json()

# convert the object into a dict
dynamic_care_care_recommendations_humidity_dict = dynamic_care_care_recommendations_humidity_instance.to_dict()
# create an instance of DynamicCareCareRecommendationsHumidity from a dict
dynamic_care_care_recommendations_humidity_form_dict = dynamic_care_care_recommendations_humidity.from_dict(dynamic_care_care_recommendations_humidity_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


