# SmartReportSummary


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**summary** | [**SmartReportSummarySummary**](SmartReportSummarySummary.md) |  | [optional] 
**model_used** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.smart_report_summary import SmartReportSummary

# TODO update the JSON string below
json = "{}"
# create an instance of SmartReportSummary from a JSON string
smart_report_summary_instance = SmartReportSummary.from_json(json)
# print the JSON string representation of the object
print SmartReportSummary.to_json()

# convert the object into a dict
smart_report_summary_dict = smart_report_summary_instance.to_dict()
# create an instance of SmartReportSummary from a dict
smart_report_summary_form_dict = smart_report_summary.from_dict(smart_report_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


