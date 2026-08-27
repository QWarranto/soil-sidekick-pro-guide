# CarbonCreditCalculationCalculationDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**credits_earned** | **float** |  | [optional] 
**calculation_method** | **str** |  | [optional] 
**baseline_carbon** | **float** |  | [optional] 
**enhanced_carbon** | **float** |  | [optional] 
**verification_confidence** | **float** |  | [optional] 
**metadata** | [**CarbonCreditCalculationCalculationDetailsMetadata**](CarbonCreditCalculationCalculationDetailsMetadata.md) |  | [optional] 

## Example

```python
from soilsidekick.models.carbon_credit_calculation_calculation_details import CarbonCreditCalculationCalculationDetails

# TODO update the JSON string below
json = "{}"
# create an instance of CarbonCreditCalculationCalculationDetails from a JSON string
carbon_credit_calculation_calculation_details_instance = CarbonCreditCalculationCalculationDetails.from_json(json)
# print the JSON string representation of the object
print CarbonCreditCalculationCalculationDetails.to_json()

# convert the object into a dict
carbon_credit_calculation_calculation_details_dict = carbon_credit_calculation_calculation_details_instance.to_dict()
# create an instance of CarbonCreditCalculationCalculationDetails from a dict
carbon_credit_calculation_calculation_details_form_dict = carbon_credit_calculation_calculation_details.from_dict(carbon_credit_calculation_calculation_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


