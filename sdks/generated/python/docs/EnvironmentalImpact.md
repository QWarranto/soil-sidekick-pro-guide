# EnvironmentalImpact


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**impact_assessment** | [**EnvironmentalImpactImpactAssessment**](EnvironmentalImpactImpactAssessment.md) |  | [optional] 
**detailed_analysis** | [**EnvironmentalImpactDetailedAnalysis**](EnvironmentalImpactDetailedAnalysis.md) |  | [optional] 
**recommendations** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.environmental_impact import EnvironmentalImpact

# TODO update the JSON string below
json = "{}"
# create an instance of EnvironmentalImpact from a JSON string
environmental_impact_instance = EnvironmentalImpact.from_json(json)
# print the JSON string representation of the object
print(EnvironmentalImpact.to_json())

# convert the object into a dict
environmental_impact_dict = environmental_impact_instance.to_dict()
# create an instance of EnvironmentalImpact from a dict
environmental_impact_from_dict = EnvironmentalImpact.from_dict(environmental_impact_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


