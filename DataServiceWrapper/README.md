# DataServiceWrapper
Illustrates wrapping LAC-based services with a data source provider, exposing service-based entities.

A data source provider operating on service-based data, driven by swagger.

<h2>Installation Instructions</h2>
Using LAC 5.2, Jetty (desktop) version with the Demo APIs installed:
<ol>
  <li>
    Stop LAC.
  </li>
  <li>
    Copy `ServiceWrapper` to your &lt;repository&gt;/system/data_source_providers folder.
  </li>
  <li>
    Restart LAC.
  </li>
  <li>
    Import Service Integration.json.
  </li>
  <li>
    Verify: run function allTests
  </li>
  <li>
    Explore the CustomerOrders_DeclarativeViaService resource.
  </li>
</ol>
