# VisualCropAnalysisRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**image** | **str** | Base64 encoded image or image URL | 
**analysis_type** | **str** |  | 
**location** | [**VisualCropAnalysisRequestLocation**](VisualCropAnalysisRequestLocation.md) |  | [optional] 
**crop_type** | **str** | Type of crop being analyzed | [optional] 

## Example

```python
from soilsidekick.models.visual_crop_analysis_request import VisualCropAnalysisRequest

# TODO update the JSON string below
json = "{}"
# create an instance of VisualCropAnalysisRequest from a JSON string
visual_crop_analysis_request_instance = VisualCropAnalysisRequest.from_json(json)
# print the JSON string representation of the object
print VisualCropAnalysisRequest.to_json()

# convert the object into a dict
visual_crop_analysis_request_dict = visual_crop_analysis_request_instance.to_dict()
# create an instance of VisualCropAnalysisRequest from a dict
visual_crop_analysis_request_form_dict = visual_crop_analysis_request.from_dict(visual_crop_analysis_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


