# VisualCropAnalysisAnalysis


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_type** | **str** |  | [optional] 
**confidence** | **float** |  | [optional] 
**findings** | **object** |  | [optional] 
**recommendations** | **List[str]** |  | [optional] 
**severity** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.visual_crop_analysis_analysis import VisualCropAnalysisAnalysis

# TODO update the JSON string below
json = "{}"
# create an instance of VisualCropAnalysisAnalysis from a JSON string
visual_crop_analysis_analysis_instance = VisualCropAnalysisAnalysis.from_json(json)
# print the JSON string representation of the object
print(VisualCropAnalysisAnalysis.to_json())

# convert the object into a dict
visual_crop_analysis_analysis_dict = visual_crop_analysis_analysis_instance.to_dict()
# create an instance of VisualCropAnalysisAnalysis from a dict
visual_crop_analysis_analysis_from_dict = VisualCropAnalysisAnalysis.from_dict(visual_crop_analysis_analysis_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


