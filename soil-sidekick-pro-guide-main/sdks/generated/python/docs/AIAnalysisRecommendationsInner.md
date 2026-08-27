# AIAnalysisRecommendationsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**priority** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.ai_analysis_recommendations_inner import AIAnalysisRecommendationsInner

# TODO update the JSON string below
json = "{}"
# create an instance of AIAnalysisRecommendationsInner from a JSON string
ai_analysis_recommendations_inner_instance = AIAnalysisRecommendationsInner.from_json(json)
# print the JSON string representation of the object
print AIAnalysisRecommendationsInner.to_json()

# convert the object into a dict
ai_analysis_recommendations_inner_dict = ai_analysis_recommendations_inner_instance.to_dict()
# create an instance of AIAnalysisRecommendationsInner from a dict
ai_analysis_recommendations_inner_form_dict = ai_analysis_recommendations_inner.from_dict(ai_analysis_recommendations_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


