import UIKit
import React
import React_RCTAppDelegate

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }
        
        let window = UIWindow(windowScene: windowScene)
        self.window = window

        if let appDelegate = UIApplication.shared.delegate as? AppDelegate,
           let factory = appDelegate.reactNativeFactory {
            factory.startReactNative(
                withModuleName: "TGHB",
                in: window,
                launchOptions: nil
            )
        }
    }
}
