#import <Foundation/Foundation.h>
#import <AppSpecs/AppSpecs.h>
#import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import "TGHB-Swift.h"

@interface RCTNativeCounter : NSObject <NativeCounterSpec>
@end

@implementation RCTNativeCounter {
    CounterModule *counter;
}

- (instancetype)init {
    if (self = [super init]) {
        counter = [[CounterModule alloc] init];
    }
    return self;
}

+ (NSString *)moduleName {
    return @"NativeCounter";
}

- (NSNumber *)increment:(double)value {
    return [counter increment:@(value)];
}

- (std::shared_ptr<facebook::react::TurboModule>)
    getTurboModule:
        (const facebook::react::ObjCTurboModule::InitParams &)params {

    return std::make_shared<
        facebook::react::NativeCounterSpecJSI>(params);
}

@end
