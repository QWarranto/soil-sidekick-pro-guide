# SafeIdentificationSafetyAnalysisLookalikesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**plant_name** | **str** |  | [optional] 
**visual_similarity** | **float** | Visual similarity score (0-100) | [optional] 
**toxicity_level** | **str** |  | [optional] 
**distinguishing_features** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_safety_analysis_lookalikes_inner import SafeIdentificationSafetyAnalysisLookalikesInner

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationSafetyAnalysisLookalikesInner from a JSON string
safe_identification_safety_analysis_lookalikes_inner_instance = SafeIdentificationSafetyAnalysisLookalikesInner.from_json(json)
# print the JSON string representation of the object
print(SafeIdentificationSafetyAnalysisLookalikesInner.to_json())

# convert the object into a dict
safe_identification_safety_analysis_lookalikes_inner_dict = safe_identification_safety_analysis_lookalikes_inner_instance.to_dict()
# create an instance of SafeIdentificationSafetyAnalysisLookalikesInner from a dict
safe_identification_safety_analysis_lookalikes_inner_from_dict = SafeIdentificationSafetyAnalysisLookalikesInner.from_dict(safe_identification_safety_analysis_lookalikes_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


