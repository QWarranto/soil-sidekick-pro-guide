# SmartReportSummarySummary


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**executive_summary** | **str** |  | [optional] 
**key_findings** | **List[str]** |  | [optional] 
**recommendations** | **List[str]** |  | [optional] 
**risk_assessment** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.smart_report_summary_summary import SmartReportSummarySummary

# TODO update the JSON string below
json = "{}"
# create an instance of SmartReportSummarySummary from a JSON string
smart_report_summary_summary_instance = SmartReportSummarySummary.from_json(json)
# print the JSON string representation of the object
print SmartReportSummarySummary.to_json()

# convert the object into a dict
smart_report_summary_summary_dict = smart_report_summary_summary_instance.to_dict()
# create an instance of SmartReportSummarySummary from a dict
smart_report_summary_summary_form_dict = smart_report_summary_summary.from_dict(smart_report_summary_summary_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


