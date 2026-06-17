import path from "path";
import { GenLayerClient } from "genlayer-js";

export default async function main(client: GenLayerClient<any>) {
  const contractFilePath = path.resolve("contracts/fact_check.py");

  console.log("Deploying FactCheckProtocol contract...");
  console.log(`Contract file: ${contractFilePath}`);

  try {
    const result = await client.deployContract({
      contractFilePath: contractFilePath,
    });

    console.log(`Contract deployed at address: ${result.address}`);
    console.log(`Transaction hash: ${result.txHash}`);

    return result;
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}
