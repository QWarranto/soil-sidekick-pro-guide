# VisualCropAnalysisRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Image** | **string** | Base64 encoded image or image URL | 
**AnalysisType** | **string** |  | 
**Location** | Pointer to [**VisualCropAnalysisRequestLocation**](VisualCropAnalysisRequestLocation.md) |  | [optional] 
**CropType** | Pointer to **string** | Type of crop being analyzed | [optional] 

## Methods

### NewVisualCropAnalysisRequest

`func NewVisualCropAnalysisRequest(image string, analysisType string, ) *VisualCropAnalysisRequest`

NewVisualCropAnalysisRequest instantiates a new VisualCropAnalysisRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewVisualCropAnalysisRequestWithDefaults

`func NewVisualCropAnalysisRequestWithDefaults() *VisualCropAnalysisRequest`

NewVisualCropAnalysisRequestWithDefaults instantiates a new VisualCropAnalysisRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetImage

`func (o *VisualCropAnalysisRequest) GetImage() string`

GetImage returns the Image field if non-nil, zero value otherwise.

### GetImageOk

`func (o *VisualCropAnalysisRequest) GetImageOk() (*string, bool)`

GetImageOk returns a tuple with the Image field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImage

`func (o *VisualCropAnalysisRequest) SetImage(v string)`

SetImage sets Image field to given value.


### GetAnalysisType

`func (o *VisualCropAnalysisRequest) GetAnalysisType() string`

GetAnalysisType returns the AnalysisType field if non-nil, zero value otherwise.

### GetAnalysisTypeOk

`func (o *VisualCropAnalysisRequest) GetAnalysisTypeOk() (*string, bool)`

GetAnalysisTypeOk returns a tuple with the AnalysisType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAnalysisType

`func (o *VisualCropAnalysisRequest) SetAnalysisType(v string)`

SetAnalysisType sets AnalysisType field to given value.


### GetLocation

`func (o *VisualCropAnalysisRequest) GetLocation() VisualCropAnalysisRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *VisualCropAnalysisRequest) GetLocationOk() (*VisualCropAnalysisRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *VisualCropAnalysisRequest) SetLocation(v VisualCropAnalysisRequestLocation)`

SetLocation sets Location field to given value.

### HasLocation

`func (o *VisualCropAnalysisRequest) HasLocation() bool`

HasLocation returns a boolean if a field has been set.

### GetCropType

`func (o *VisualCropAnalysisRequest) GetCropType() string`

GetCropType returns the CropType field if non-nil, zero value otherwise.

### GetCropTypeOk

`func (o *VisualCropAnalysisRequest) GetCropTypeOk() (*string, bool)`

GetCropTypeOk returns a tuple with the CropType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCropType

`func (o *VisualCropAnalysisRequest) SetCropType(v string)`

SetCropType sets CropType field to given value.

### HasCropType

`func (o *VisualCropAnalysisRequest) HasCropType() bool`

HasCropType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


