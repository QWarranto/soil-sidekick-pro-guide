# TurboQuantCapabilities

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Supported** | Pointer to **bool** | Whether TurboQuant is supported on this device | [optional] 
**RecommendedModel** | Pointer to **string** | Recommended model for the device | [optional] 
**MaxContextTokens** | Pointer to **int32** | Maximum context window feasible on this device | [optional] 
**EstimatedKvCacheGb** | Pointer to **float32** | Estimated KV cache size in GB | [optional] 
**KvCompressionRatio** | Pointer to **string** | Compression ratio vs 16-bit baseline | [optional] 
**EstimatedLatencyMs** | Pointer to [**TurboQuantCapabilitiesEstimatedLatencyMs**](TurboQuantCapabilitiesEstimatedLatencyMs.md) |  | [optional] 
**RuntimeTier** | Pointer to **string** | Detected or recommended runtime | [optional] 

## Methods

### NewTurboQuantCapabilities

`func NewTurboQuantCapabilities() *TurboQuantCapabilities`

NewTurboQuantCapabilities instantiates a new TurboQuantCapabilities object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTurboQuantCapabilitiesWithDefaults

`func NewTurboQuantCapabilitiesWithDefaults() *TurboQuantCapabilities`

NewTurboQuantCapabilitiesWithDefaults instantiates a new TurboQuantCapabilities object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSupported

`func (o *TurboQuantCapabilities) GetSupported() bool`

GetSupported returns the Supported field if non-nil, zero value otherwise.

### GetSupportedOk

`func (o *TurboQuantCapabilities) GetSupportedOk() (*bool, bool)`

GetSupportedOk returns a tuple with the Supported field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSupported

`func (o *TurboQuantCapabilities) SetSupported(v bool)`

SetSupported sets Supported field to given value.

### HasSupported

`func (o *TurboQuantCapabilities) HasSupported() bool`

HasSupported returns a boolean if a field has been set.

### GetRecommendedModel

`func (o *TurboQuantCapabilities) GetRecommendedModel() string`

GetRecommendedModel returns the RecommendedModel field if non-nil, zero value otherwise.

### GetRecommendedModelOk

`func (o *TurboQuantCapabilities) GetRecommendedModelOk() (*string, bool)`

GetRecommendedModelOk returns a tuple with the RecommendedModel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendedModel

`func (o *TurboQuantCapabilities) SetRecommendedModel(v string)`

SetRecommendedModel sets RecommendedModel field to given value.

### HasRecommendedModel

`func (o *TurboQuantCapabilities) HasRecommendedModel() bool`

HasRecommendedModel returns a boolean if a field has been set.

### GetMaxContextTokens

`func (o *TurboQuantCapabilities) GetMaxContextTokens() int32`

GetMaxContextTokens returns the MaxContextTokens field if non-nil, zero value otherwise.

### GetMaxContextTokensOk

`func (o *TurboQuantCapabilities) GetMaxContextTokensOk() (*int32, bool)`

GetMaxContextTokensOk returns a tuple with the MaxContextTokens field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxContextTokens

`func (o *TurboQuantCapabilities) SetMaxContextTokens(v int32)`

SetMaxContextTokens sets MaxContextTokens field to given value.

### HasMaxContextTokens

`func (o *TurboQuantCapabilities) HasMaxContextTokens() bool`

HasMaxContextTokens returns a boolean if a field has been set.

### GetEstimatedKvCacheGb

`func (o *TurboQuantCapabilities) GetEstimatedKvCacheGb() float32`

GetEstimatedKvCacheGb returns the EstimatedKvCacheGb field if non-nil, zero value otherwise.

### GetEstimatedKvCacheGbOk

`func (o *TurboQuantCapabilities) GetEstimatedKvCacheGbOk() (*float32, bool)`

GetEstimatedKvCacheGbOk returns a tuple with the EstimatedKvCacheGb field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEstimatedKvCacheGb

`func (o *TurboQuantCapabilities) SetEstimatedKvCacheGb(v float32)`

SetEstimatedKvCacheGb sets EstimatedKvCacheGb field to given value.

### HasEstimatedKvCacheGb

`func (o *TurboQuantCapabilities) HasEstimatedKvCacheGb() bool`

HasEstimatedKvCacheGb returns a boolean if a field has been set.

### GetKvCompressionRatio

`func (o *TurboQuantCapabilities) GetKvCompressionRatio() string`

GetKvCompressionRatio returns the KvCompressionRatio field if non-nil, zero value otherwise.

### GetKvCompressionRatioOk

`func (o *TurboQuantCapabilities) GetKvCompressionRatioOk() (*string, bool)`

GetKvCompressionRatioOk returns a tuple with the KvCompressionRatio field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetKvCompressionRatio

`func (o *TurboQuantCapabilities) SetKvCompressionRatio(v string)`

SetKvCompressionRatio sets KvCompressionRatio field to given value.

### HasKvCompressionRatio

`func (o *TurboQuantCapabilities) HasKvCompressionRatio() bool`

HasKvCompressionRatio returns a boolean if a field has been set.

### GetEstimatedLatencyMs

`func (o *TurboQuantCapabilities) GetEstimatedLatencyMs() TurboQuantCapabilitiesEstimatedLatencyMs`

GetEstimatedLatencyMs returns the EstimatedLatencyMs field if non-nil, zero value otherwise.

### GetEstimatedLatencyMsOk

`func (o *TurboQuantCapabilities) GetEstimatedLatencyMsOk() (*TurboQuantCapabilitiesEstimatedLatencyMs, bool)`

GetEstimatedLatencyMsOk returns a tuple with the EstimatedLatencyMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEstimatedLatencyMs

`func (o *TurboQuantCapabilities) SetEstimatedLatencyMs(v TurboQuantCapabilitiesEstimatedLatencyMs)`

SetEstimatedLatencyMs sets EstimatedLatencyMs field to given value.

### HasEstimatedLatencyMs

`func (o *TurboQuantCapabilities) HasEstimatedLatencyMs() bool`

HasEstimatedLatencyMs returns a boolean if a field has been set.

### GetRuntimeTier

`func (o *TurboQuantCapabilities) GetRuntimeTier() string`

GetRuntimeTier returns the RuntimeTier field if non-nil, zero value otherwise.

### GetRuntimeTierOk

`func (o *TurboQuantCapabilities) GetRuntimeTierOk() (*string, bool)`

GetRuntimeTierOk returns a tuple with the RuntimeTier field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRuntimeTier

`func (o *TurboQuantCapabilities) SetRuntimeTier(v string)`

SetRuntimeTier sets RuntimeTier field to given value.

### HasRuntimeTier

`func (o *TurboQuantCapabilities) HasRuntimeTier() bool`

HasRuntimeTier returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


