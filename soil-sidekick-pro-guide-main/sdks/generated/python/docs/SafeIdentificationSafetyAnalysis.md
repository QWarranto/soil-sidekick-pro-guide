# SafeIdentificationSafetyAnalysis


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**toxicity_level** | **str** |  | [optional] 
**toxic_to** | **List[str]** | List of animals/people this is toxic to (e.g., cats, dogs, children) | [optional] 
**lookalikes** | [**List[SafeIdentificationSafetyAnalysisLookalikesInner]**](SafeIdentificationSafetyAnalysisLookalikesInner.md) |  | [optional] 
**warnings** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_safety_analysis import SafeIdentificationSafetyAnalysis

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationSafetyAnalysis from a JSON string
safe_identification_safety_analysis_instance = SafeIdentificationSafetyAnalysis.from_json(json)
# print the JSON string representation of the object
print SafeIdentificationSafetyAnalysis.to_json()

# convert the object into a dict
safe_identification_safety_analysis_dict = safe_identification_safety_analysis_instance.to_dict()
# create an instance of SafeIdentificationSafetyAnalysis from a dict
safe_identification_safety_analysis_form_dict = safe_identification_safety_analysis.from_dict(safe_identification_safety_analysis_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


