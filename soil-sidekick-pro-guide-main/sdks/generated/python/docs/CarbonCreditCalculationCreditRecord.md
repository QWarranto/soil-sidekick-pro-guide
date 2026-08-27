# CarbonCreditCalculationCreditRecord


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | [optional] 
**field_name** | **str** |  | [optional] 
**field_size_acres** | **float** |  | [optional] 
**credits_earned** | **float** |  | [optional] 
**verification_status** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.carbon_credit_calculation_credit_record import CarbonCreditCalculationCreditRecord

# TODO update the JSON string below
json = "{}"
# create an instance of CarbonCreditCalculationCreditRecord from a JSON string
carbon_credit_calculation_credit_record_instance = CarbonCreditCalculationCreditRecord.from_json(json)
# print the JSON string representation of the object
print CarbonCreditCalculationCreditRecord.to_json()

# convert the object into a dict
carbon_credit_calculation_credit_record_dict = carbon_credit_calculation_credit_record_instance.to_dict()
# create an instance of CarbonCreditCalculationCreditRecord from a dict
carbon_credit_calculation_credit_record_form_dict = carbon_credit_calculation_credit_record.from_dict(carbon_credit_calculation_credit_record_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


