# EnvironmentalImpactImpactAssessment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**runoff_risk_score** | **float** |  | [optional] 
**water_body_proximity** | **float** |  | [optional] 
**contamination_risk** | **str** |  | [optional] 
**carbon_footprint_score** | **float** |  | [optional] 
**biodiversity_impact** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.environmental_impact_impact_assessment import EnvironmentalImpactImpactAssessment

# TODO update the JSON string below
json = "{}"
# create an instance of EnvironmentalImpactImpactAssessment from a JSON string
environmental_impact_impact_assessment_instance = EnvironmentalImpactImpactAssessment.from_json(json)
# print the JSON string representation of the object
print(EnvironmentalImpactImpactAssessment.to_json())

# convert the object into a dict
environmental_impact_impact_assessment_dict = environmental_impact_impact_assessment_instance.to_dict()
# create an instance of EnvironmentalImpactImpactAssessment from a dict
environmental_impact_impact_assessment_from_dict = EnvironmentalImpactImpactAssessment.from_dict(environmental_impact_impact_assessment_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


