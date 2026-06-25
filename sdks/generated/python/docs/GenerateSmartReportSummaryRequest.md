# GenerateSmartReportSummaryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**report_type** | **str** |  | 
**report_data** | **object** | Report data to summarize | 

## Example

```python
from soilsidekick.models.generate_smart_report_summary_request import GenerateSmartReportSummaryRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GenerateSmartReportSummaryRequest from a JSON string
generate_smart_report_summary_request_instance = GenerateSmartReportSummaryRequest.from_json(json)
# print the JSON string representation of the object
print(GenerateSmartReportSummaryRequest.to_json())

# convert the object into a dict
generate_smart_report_summary_request_dict = generate_smart_report_summary_request_instance.to_dict()
# create an instance of GenerateSmartReportSummaryRequest from a dict
generate_smart_report_summary_request_from_dict = GenerateSmartReportSummaryRequest.from_dict(generate_smart_report_summary_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


