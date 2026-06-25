# EnvironmentalImpactDetailedAnalysis


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**runoff_risk** | [**EnvironmentalImpactDetailedAnalysisRunoffRisk**](EnvironmentalImpactDetailedAnalysisRunoffRisk.md) |  | [optional] 
**contamination_assessment** | **object** |  | [optional] 
**eco_alternatives** | [**EnvironmentalImpactDetailedAnalysisEcoAlternatives**](EnvironmentalImpactDetailedAnalysisEcoAlternatives.md) |  | [optional] 
**carbon_analysis** | **object** |  | [optional] 
**biodiversity_assessment** | **object** |  | [optional] 

## Example

```python
from soilsidekick.models.environmental_impact_detailed_analysis import EnvironmentalImpactDetailedAnalysis

# TODO update the JSON string below
json = "{}"
# create an instance of EnvironmentalImpactDetailedAnalysis from a JSON string
environmental_impact_detailed_analysis_instance = EnvironmentalImpactDetailedAnalysis.from_json(json)
# print the JSON string representation of the object
print(EnvironmentalImpactDetailedAnalysis.to_json())

# convert the object into a dict
environmental_impact_detailed_analysis_dict = environmental_impact_detailed_analysis_instance.to_dict()
# create an instance of EnvironmentalImpactDetailedAnalysis from a dict
environmental_impact_detailed_analysis_from_dict = EnvironmentalImpactDetailedAnalysis.from_dict(environmental_impact_detailed_analysis_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


