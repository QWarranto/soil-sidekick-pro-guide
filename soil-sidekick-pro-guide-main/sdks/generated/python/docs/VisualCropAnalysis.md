# VisualCropAnalysis


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**analysis** | [**VisualCropAnalysisAnalysis**](VisualCropAnalysisAnalysis.md) |  | [optional] 
**analysis_id** | **str** |  | [optional] 
**timestamp** | **datetime** |  | [optional] 

## Example

```python
from soilsidekick.models.visual_crop_analysis import VisualCropAnalysis

# TODO update the JSON string below
json = "{}"
# create an instance of VisualCropAnalysis from a JSON string
visual_crop_analysis_instance = VisualCropAnalysis.from_json(json)
# print the JSON string representation of the object
print VisualCropAnalysis.to_json()

# convert the object into a dict
visual_crop_analysis_dict = visual_crop_analysis_instance.to_dict()
# create an instance of VisualCropAnalysis from a dict
visual_crop_analysis_form_dict = visual_crop_analysis.from_dict(visual_crop_analysis_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


