# AIAnalysis


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_type** | **str** |  | [optional] 
**confidence_score** | **float** |  | [optional] 
**recommendations** | [**List[AIAnalysisRecommendationsInner]**](AIAnalysisRecommendationsInner.md) |  | [optional] 

## Example

```python
from soilsidekick.models.ai_analysis import AIAnalysis

# TODO update the JSON string below
json = "{}"
# create an instance of AIAnalysis from a JSON string
ai_analysis_instance = AIAnalysis.from_json(json)
# print the JSON string representation of the object
print(AIAnalysis.to_json())

# convert the object into a dict
ai_analysis_dict = ai_analysis_instance.to_dict()
# create an instance of AIAnalysis from a dict
ai_analysis_from_dict = AIAnalysis.from_dict(ai_analysis_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


