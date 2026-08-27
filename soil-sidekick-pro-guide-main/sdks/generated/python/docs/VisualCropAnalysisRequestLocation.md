# VisualCropAnalysisRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**county_name** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.visual_crop_analysis_request_location import VisualCropAnalysisRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of VisualCropAnalysisRequestLocation from a JSON string
visual_crop_analysis_request_location_instance = VisualCropAnalysisRequestLocation.from_json(json)
# print the JSON string representation of the object
print VisualCropAnalysisRequestLocation.to_json()

# convert the object into a dict
visual_crop_analysis_request_location_dict = visual_crop_analysis_request_location_instance.to_dict()
# create an instance of VisualCropAnalysisRequestLocation from a dict
visual_crop_analysis_request_location_form_dict = visual_crop_analysis_request_location.from_dict(visual_crop_analysis_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


