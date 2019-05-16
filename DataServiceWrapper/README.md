# DataServiceWrapper
Illustrates wrapping LAC-based services with a Data Source Provider, exposing service-based entities

A Data Source Provider operating on service-based data, driven by swagger.

<h2>Install Instructions</h2>
Using LAC 5.2 or higher, Jetty (desktop) version with Demo projects installed:
<ol>
  <li>
    Stop LAC
  </li>
  <li>
    Copy `ServiceWrapper` to your &lt;repository&gt;/system/data_source_providers folder
  </li>
  <li>
    Restart LAC
  </li>
  <li>
    Import Service Integration.json
  </li>
  <li>
    Verify: run function allTests
  </li>
  <li>
    Explore Resource CustomerOrders_DeclarativeViaService
  </li>
</ol>
  
