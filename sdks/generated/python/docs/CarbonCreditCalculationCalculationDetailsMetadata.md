# CarbonCreditCalculationCalculationDetailsMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**calculation_factors** | **object** |  | [optional] 
**data_sources** | **List[str]** |  | [optional] 
**confidence_score** | **float** |  | [optional] 

## Example

```python
from soilsidekick.models.carbon_credit_calculation_calculation_details_metadata import CarbonCreditCalculationCalculationDetailsMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of CarbonCreditCalculationCalculationDetailsMetadata from a JSON string
carbon_credit_calculation_calculation_details_metadata_instance = CarbonCreditCalculationCalculationDetailsMetadata.from_json(json)
# print the JSON string representation of the object
print(CarbonCreditCalculationCalculationDetailsMetadata.to_json())

# convert the object into a dict
carbon_credit_calculation_calculation_details_metadata_dict = carbon_credit_calculation_calculation_details_metadata_instance.to_dict()
# create an instance of CarbonCreditCalculationCalculationDetailsMetadata from a dict
carbon_credit_calculation_calculation_details_metadata_from_dict = CarbonCreditCalculationCalculationDetailsMetadata.from_dict(carbon_credit_calculation_calculation_details_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


