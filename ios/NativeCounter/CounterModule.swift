
import Foundation

@objc(CounterModule)
public class CounterModule: NSObject {

    @objc
    public func increment(_ value: NSNumber) -> NSNumber {
        return NSNumber(value: value.intValue + 1)
    }
}
