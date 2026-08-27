# CarbonCreditCalculation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**credit_record** | [**CarbonCreditCalculationCreditRecord**](CarbonCreditCalculationCreditRecord.md) |  | [optional] 
**calculation_details** | [**CarbonCreditCalculationCalculationDetails**](CarbonCreditCalculationCalculationDetails.md) |  | [optional] 

## Example

```python
from soilsidekick.models.carbon_credit_calculation import CarbonCreditCalculation

# TODO update the JSON string below
json = "{}"
# create an instance of CarbonCreditCalculation from a JSON string
carbon_credit_calculation_instance = CarbonCreditCalculation.from_json(json)
# print the JSON string representation of the object
print CarbonCreditCalculation.to_json()

# convert the object into a dict
carbon_credit_calculation_dict = carbon_credit_calculation_instance.to_dict()
# create an instance of CarbonCreditCalculation from a dict
carbon_credit_calculation_form_dict = carbon_credit_calculation.from_dict(carbon_credit_calculation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


